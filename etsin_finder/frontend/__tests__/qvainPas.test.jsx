import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'
import axios from 'axios'

import '../locale/translations'

import etsinTheme from '../js/styles/theme'
import PasState from '../js/components/qvain/editor/pasState'
import DescriptionField from '../js/components/qvain/description/descriptionField'
import OtherIdentifierField from '../js/components/qvain/description/otherIdentifierField'
import FieldOfScienceField from '../js/components/qvain/description/fieldOfScienceField'
import KeywordsField from '../js/components/qvain/description/keywordsField'
import License from '../js/components/qvain/licenses/licenses'
import AccessType from '../js/components/qvain/licenses/accessType'
import FileForm from '../js/components/qvain/files/ida/forms/fileForm'
import DirectoryForm from '../js/components/qvain/files/ida/forms/directoryForm'
import { File, Directory, Project } from '../js/stores/view/common.files.items'
import QvainStoreClass, {
  AccessType as AccessTypeConstructor,
  License as LicenseConstructor,
} from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'
import EnvStore from '../js/stores/domain/env'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '../js/utils/constants'
import { metaxResponses } from './__testdata__/qvainPas.data'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

const QvainStore = new QvainStoreClass(EnvStore)

const getStores = () => {
  QvainStore.resetQvainStore()
  EnvStore.setMetaxApiV2(true)
  return {
    Qvain: QvainStore,
    Locale: LocaleStore,
    Env: EnvStore,
  }
}

jest.mock('axios')
axios.get.mockImplementation(url => {
  const path = new URL(url).pathname
  if (!metaxResponses[path]) {
    console.error(`Error: no mock response for ${path}`)
  }
  return Promise.resolve({
    data: metaxResponses[path],
  })
})

// Unmount mounted components after each test to avoid tests affecting each other.
let wrapper
afterEach(() => {
  if (wrapper && wrapper.unmount && wrapper.length === 1) {
    wrapper.unmount()
    wrapper = null
  }
})

describe('Qvain.PasState', () => {
  const render = stores => {
    stores.Qvain.Keywords.set(['key', 'word'])
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <PasState />
        </ThemeProvider>
      </Provider>
    )
  }

  it('shows pas state', () => {
    const stores = getStores()
    stores.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.IDA
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores)
    expect(wrapper.find(PasState).text().includes('80:')).toBe(true)
    wrapper.unmount()

    stores.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.PAS
    stores.Qvain.setPreservationState(0)
    wrapper = render(stores)
    expect(wrapper.find(PasState).text().includes('80:')).toBe(false)
    expect(wrapper.find(PasState).text().includes('0:')).toBe(true)
  })
})

describe('Qvain.Description', () => {
  const render = stores => {
    stores.Qvain.Keywords.set(['key', 'word'])
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <>
            <DescriptionField />
            <OtherIdentifierField />
            <FieldOfScienceField />
            <KeywordsField />
          </>
        </ThemeProvider>
      </Provider>
    )
  }

  it('prevents editing of description fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))
    wrapper.unmount()

    // Keyword delete buttons should not be rendered
    expect(wrapper.find('FontAwesomeIcon.delete-keyword').length).toBe(0)
  })

  it('allows editing of description fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(0)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    // Keyword delete buttons should be rendered
    expect(wrapper.find('FontAwesomeIcon.delete-keyword').length).toBe(2)
  })
})

describe('Qvain.RightsAndLicenses', () => {
  const render = stores => {
    stores.Qvain.Licenses.set([
      stores.Qvain.Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'other'),
    ])
    stores.Qvain.AccessType.set(
      stores.Qvain.AccessType.Model({ en: 'Embargo' }, ACCESS_TYPE_URL.EMBARGO)
    )
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <>
            <License />
            <AccessType />
          </>
        </ThemeProvider>
      </Provider>
    )
  }

  it('prevents editing of rights and license fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    // Expect inputs: license, access type, restriction grounds, embargo expires
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of rights and license fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(130)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    // Expect inputs: license, access type, restriction grounds, embargo expires
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))
  })
})

describe('Qvain.Files', () => {
  const render = (stores, editDirectory) => {
    const testfile = File({
      description: 'File',
      title: 'testfile',
      existing: false,
      file_name: 'test.pdf',
      file_path: '/test/test.pdf',
      identifier: 'test_file',
      project_identifier: 'project_y',
      file_characteristics: {
        file_format: 'text/csv',
        format_version: '',
        encoding: 'UTF-8',
        csv_has_header: true,
        csv_record_separator: 'LF',
        csv_quoting_char: '"',
      },
    })
    const testDirectory = Directory(
      {
        id: 'test2',
        identifier: 'test-ident-2',
        project_identifier: 'project_y',
        directory_name: 'directory2',
        directories: [],
        files: [],
      },
      undefined,
      false,
      false
    )
    stores.Qvain.Files.selectedProject = 'project_y'
    stores.Qvain.Files.root = Project(
      {
        id: 'test1',
        identifier: 'test-ident-1',
        project_identifier: 'project_y',
        directories: [testDirectory],
        files: [testfile],
      },
      undefined,
      false,
      true
    )
    let Form
    if (editDirectory) {
      stores.Qvain.Files.setInEdit(testDirectory)
      Form = DirectoryForm
    } else {
      stores.Qvain.Files.setInEdit(testfile)
      Form = FileForm
    }
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <Form requestClose={() => {}} setChanged={() => {}} />
        </ThemeProvider>
      </Provider>
    )
  }

  it('prevents editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(0)
    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(false))
  })

  it('prevents editing of directory fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores, true)

    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(2)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of directory fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(100)
    wrapper = render(stores, true)

    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(2)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(false))
  })
})
