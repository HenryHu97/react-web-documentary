import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import RootReducer from './reducer'
// import { persistStore, persistReducer } from 'redux-persist'
// import storageSession from 'redux-persist/es/storage/session'

// const persistConfig = {
//   key: 'root',
//   storage:storageSession,
// }
// const myPersistedReducer = persistReducer(persistConfig, RootReducer)

const store = createStore(RootReducer, applyMiddleware(thunk))

export default store
