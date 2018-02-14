import React, { Component } from 'react'
import Translate from 'react-translate-component'
import DataItem from './dataItem'
import { accessRightsBool } from '../data/accessRights'
import DatasetQuery from '../../../stores/view/datasetquery'
import checkDataLang from '../../../utils/checkDataLang'
import Breadcrumbs from './breadcrumbs'
import sizeParse from '../../../utils/sizeParse'
import createTree from '../../../utils/createTree'
import Loader from '../../general/loader'
import { InvertedButton } from '../../general/button'

export default class Downloads extends Component {
  constructor(props) {
    super(props)
    const results = DatasetQuery.results
    const files = results.research_dataset.files
    const folders = results.research_dataset.directories
    const combined = this.createDirTree(files, folders)
    const fileDirTree = createTree(combined)
    this.state = {
      results,
      filesAndFolders: combined,
      access: accessRightsBool(results.research_dataset.access_rights),
      fileDirTree,
      currentFolder: fileDirTree,
      currentPath: [],
      currentIDs: [],
      loading: false,
    }

    this.updatePath = this.updatePath.bind(this)
    this.tableItems = this.tableItems.bind(this)
    this.changeFolder = this.changeFolder.bind(this)
    this.query = this.query.bind(this)
  }

  createDirTree(files, folders, fileApi = false) {
    let filePaths = []
    let folderPaths = []
    if (files) {
      filePaths = files.map(file => {
        let fileType
        let fileDetails = file.details
        if (file.type || file.file_type) {
          fileType = file.type
            ? checkDataLang(file.type.pref_label)
            : checkDataLang(file.file_type.pref_label)
        }
        if (fileApi) {
          fileDetails = file
        }
        return {
          path: fileDetails.file_path.substring(1),
          type: fileType,
          details: fileDetails,
          use_category: file.use_category,
          title: file.title,
          identifier: file.identifier,
        }
      })
    }
    if (folders) {
      folderPaths = folders.map(folder => {
        let folderDetails = folder.details
        if (fileApi) {
          folderDetails = folder
        }
        return {
          path: folderDetails.directory_path.substring(1),
          type: 'dir',
          details: folderDetails,
          use_category: folder.use_category,
          title: folder.title,
          identifier: folder.identifier,
        }
      })
    }
    return filePaths.concat(folderPaths)
  }

  query(id, newPath, newIDs) {
    this.setState({
      loading: true,
    })
    DatasetQuery.getFolderData(id)
      .then(res => {
        const currFolder = createTree(
          this.createDirTree(res.files, res.directories, true)
        ).reverse()
        this.setState({
          currentPath: newPath,
          currentIDs: newIDs,
          currentFolder: currFolder,
          loading: false,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  changeFolder(folderName, id) {
    const path = this.state.currentPath.slice()
    path.push(folderName)
    const identifiers = this.state.currentIDs.slice()
    identifiers.push(id)
    const clickedFolder = this.state.currentFolder.find(single => single.identifier === id)
    this.query(clickedFolder.identifier, path, identifiers)
  }

  updatePath(path, id) {
    if (!path) {
      this.setState({
        currentPath: [],
        currentIDs: [],
        currentFolder: this.state.fileDirTree,
      })
    } else {
      const currentIDs = this.state.currentIDs.slice()
      const newIDs = currentIDs.slice(0, currentIDs.indexOf(id) + 1)
      const currentPaths = this.state.currentPath.slice()
      const newPaths = currentPaths.slice(0, currentPaths.indexOf(path) + 1)

      this.query(id, newPaths, newIDs)
    }
  }

  tableItems(folder) {
    return folder.map((single, i) => {
      let current = single
      // check if file is among described files (if there is more information available)
      const described = this.state.filesAndFolders.filter(
        item => item.identifier === single.identifier
      )[0]
      if (described) {
        current = described
      }
      return (
        <DataItem
          key={`dataitem-${current.details.identifier}`}
          item={current}
          index={i}
          changeFolder={this.changeFolder}
          access={this.state.access}
        />
      )
    })
  }

  render() {
    if (!this.state.results) {
      return 'Loading'
    }

    return (
      <div className="dataset-downloads">
        <div className="downloads-header d-flex justify-content-between">
          <div className="heading-right">
            <div className="title">
              <Translate content="dataset.dl.files" />
            </div>
            <div className="files-size-all">
              {`${this.state.results.research_dataset.files.length} aineistoa (${sizeParse(
                this.state.results.research_dataset.total_ida_byte_size,
                1
              )})`}
            </div>
          </div>
          <Loader left active={this.state.loading} color="white" />
          <div className="heading-left d-flex align-items-center">
            <InvertedButton color="white" disabled={!this.state.access}>
              <Translate content="dataset.dl.downloadAll" />
            </InvertedButton>
          </div>
        </div>
        <Breadcrumbs
          path={this.state.currentPath}
          ids={this.state.currentIDs}
          callback={this.updatePath}
        />
        <table className="table downloads-table">
          <thead className="thead-dark">
            <tr>
              <th className="rowIcon" scope="col" />
              <th className="rowName" scope="col">
                <Translate content="dataset.dl.name" />
              </th>
              <th className="rowSize" scope="col">
                <Translate content="dataset.dl.size" />
              </th>
              <th className="rowCategory" scope="col">
                <Translate content="dataset.dl.category" />
              </th>
              <th className="rowButtons" scope="col" />
            </tr>
          </thead>
          <tbody>{this.tableItems(this.state.currentFolder)}</tbody>
        </table>
      </div>
    )
  }
}
