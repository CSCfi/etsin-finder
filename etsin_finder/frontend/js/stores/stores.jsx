import React from 'react'
import PropTypes from 'prop-types'

export const StoresContext = React.createContext()

export const StoresProvider = ({ store, children }) => (
  <StoresContext.Provider value={store}>{children}</StoresContext.Provider>
)

StoresProvider.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.node,
}

StoresProvider.defaultProps = {
  children: null,
}

export const useStores = () => React.useContext(StoresContext)

export const withStores = Component =>
  React.forwardRef((props, ref) => <Component ref={ref} {...props} Stores={useStores()} />)
