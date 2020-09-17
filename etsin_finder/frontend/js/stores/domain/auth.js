/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, runInAction } from 'mobx'
import axios from 'axios'

class Auth {
  @observable userLogged = false

  @observable cscUserLogged = false

  @observable loading = false

  @observable initializing = true

  @observable user = {
    name: undefined,
    firsName: undefined,
    lastName: undefined,
    loggedIn: false,
    homeOrganizationName: undefined,
    idaGroups: [],
    isUsingRems: undefined,
  }

  @action
  resetUser = () => {
    this.user = {
      name: undefined,
      firsName: undefined,
      lastName: undefined,
      loggedIn: false,
      homeOrganizationName: undefined,
      idaGroups: [],
      isUsingRems: undefined,
    }
  }

  @action
  reset = () => {
    this.resetUser()
    this.userLogged = false
    this.cscUserLogged = false
    this.loading = false
  }

  @action
  checkLogin() {
    return new Promise((resolve, reject) => {
      runInAction(() => {
        this.loading = true
      })
      axios
        .get('/api/user', {
          headers: { 'content-type': 'application/json', charset: 'utf-8' },
          withCredentials: true
        })
        .then(
          action(res => {
            console.log(res.data)
            this.user = {
              name: res.data.user_csc_name,
              firstName: res.data.first_name,
              lastName: res.data.last_name,
              loggedIn: res.data.is_authenticated,
              homeOrganizationName: res.data.home_organization_name,
              idaGroups: res.data.user_ida_groups,
              isUsingRems: res.data.is_using_rems,
            }
            if (res.data.is_authenticated && !res.data.is_authenticated_CSC_user) {
              // The user was able to verify themself using HAKA or some other external verification,
              // but do not have a valid CSC account and should not be granted permission.
              this.userLogged = false
              this.cscUserLogged = false
            } else if (!res.data.home_organization_name) {
              // The user was able to verify themself using their CSC account,
              // but do not have a home organization set (sui.csc.fi) and should not be granted permission.
              this.userLogged = false
              this.cscUserLogged = false
            } else if (
              res.data.is_authenticated &&
              res.data.is_authenticated_CSC_user &&
              res.data.home_organization_name
            ) {
              // The user has a valid CSC account with a defined home organization. Login successful.
              this.userLogged = res.data.is_authenticated
              this.cscUserLogged = res.data.is_authenticated_CSC_user
            } else {
              // If any of the checks failed, the user should not be logged in. The variables keep their 'false' value.
              this.userLogged = false
              this.cscUserLogged = false
            }
            this.loading = false
            this.initializing = false
            resolve(res)
          })
        )
        .catch(
          action(err => {
            this.loading = false
            console.log(err)
            reject(err)
          })
        )
    })
  }

  @action
  logout() {
    return new Promise((resolve, reject) => {
      axios
        .delete('/api/session')
        .then(res => {
          this.userLogged = false
          this.cscUserLogged = false

          // Since the user will be logged out, all user.* variables should be reset to default values.
          this.resetUser()
          resolve(res)
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  }

  /* keepAlive component calls renewsession if user is active */
  @action
  renewSession() {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/session')
        .then(() => resolve())
        .catch(err => {
          if (err.response.status === 401) {
            this.reset()
          }
          return reject(err)
        })
    })
  }
}

export default new Auth()
