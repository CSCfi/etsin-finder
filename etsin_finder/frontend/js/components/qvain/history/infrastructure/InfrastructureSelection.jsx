import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Infrastructure, Infrastructures } from '../../../../stores/view/qvain'
import SelectedItems from '../../general/selectedItems'
import Select from '../../general/select'
import AddButton from '../../general/addButton'

class InfrastructureSelection extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  render() {
    const {
      setInfrastructure,
      infrastructure,
      setInfrastructures,
      infrastructures,
    } = this.props.Stores.Qvain
    return (
      <>
        <SelectedItems getter={infrastructures} />
        <Select
          name="infrastructure"
          getter={infrastructure}
          setter={setInfrastructure}
          model={Infrastructure}
          metaxIdentifier="research_infra"
        />
        <AddButton
          translation="qvain.history.infrastructure.addButton"
          setter={setInfrastructures}
          getter={infrastructures}
          selection={infrastructure}
          model={Infrastructures}
        />
      </>
    )
  }
}

export default inject('Stores')(observer(InfrastructureSelection))
