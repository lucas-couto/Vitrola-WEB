import {createStore, combineReducers} from 'redux'
import searchReducer from './reducers/searchReducer'
import artistReducer from './reducers/artistReducer'
import albumReducer from './reducers/albumReducer'
import playMusicReducer from './reducers/playMusicReducer'
import playlistReducer from './reducers/playlistReducer'
import recommendationReducer from './reducers/recommendationReducer'
import loadingReducer from './reducers/loadingReducer'

const reducers = combineReducers({
    search: searchReducer,
    artist: artistReducer,
    album: albumReducer,
    playMusic: playMusicReducer,
    playlist: playlistReducer,
    recommendation: recommendationReducer,
    loading: loadingReducer,
})

const storeConfig = () => {
    return createStore(reducers)
}

export default storeConfig