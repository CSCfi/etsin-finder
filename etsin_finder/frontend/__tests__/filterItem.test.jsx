import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import createHistory from 'history/createBrowserHistory'

import FilterItem from '../js/components/search/filterResults/filterItem'
import ElasticQuery from '../js/stores/view/elasticquery'

const history = createHistory()

describe('FilterItem', () => {
  ElasticQuery.updateSearch('Helsinki', history)
  const facet = { item: { key: 'Pirkko Suihkonen', doc_count: 92 }, aggregationName: 'Creator', termName: 'creator_name.keyword' }
  describe('Filter not active', () => {
    const filterItem = mount(<FilterItem
      key={facet.item.key}
      item={facet.item}
      aggregationName={facet.aggregationName}
      term={facet.termName}
      history={history}
    />);
    it('should contain button', () => {
      expect(filterItem.children().children().type()).toEqual('button')
    })
    it('should contain key and doc_count', () => {
      expect(filterItem.text()).toEqual('Pirkko Suihkonen (92)')
    })
    it('should not be active', () => {
      expect(filterItem.state().active).toEqual(false)
    })
  })
  describe('Filter currently active', () => {
    ElasticQuery.updateFilter(facet.termName, facet.item.key, history)
    const filterItem = shallow(<FilterItem
      key={facet.item.key}
      item={facet.item}
      aggregationName={facet.aggregationName}
      term={facet.termName}
      history={history}
    />);
    it('should be active', () => {
      expect(filterItem.state().active).toEqual(true)
    })
  })
})
