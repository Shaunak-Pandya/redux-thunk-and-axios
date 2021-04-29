const redux = require('redux');
const thunk = require('redux-thunk').default
const axios = require('axios')

const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

const initialState = {
	loading : false,
	users : [],
	error : ''
}

const FETCH_REQUEST = 'FETCH_REQUEST'
const FETCH_SUCCESS = 'FETCH_SUCCESS'
const FETCH_ERROR = 'FETCH_ERROR'

const fetchRequest = () => {
	return {
		type : FETCH_REQUEST
	}
}

const fetchSuccess = users => {
	return {
		type : FETCH_SUCCESS,
		payload : users
	}
}

const fetchError = error => {
	return {
		type : FETCH_ERROR,
		payload : error
	}
}

const reducer = (state = initialState, action) => {
	switch(action.type) {
		case FETCH_REQUEST: return {
			...state,
			loading : true
		}
		case FETCH_SUCCESS: return {
			loading : false,
			users : action.payload,
			error : 'Data fetched successfully'
		}
		case FETCH_ERROR : return {
			loading : false,
			users : [],
			error : action.payload
		}
	}
}

const fetchUsers = () => {
	return function(dispatch) {
		dispatch(fetchRequest())
		axios.get('https://jsonplaceholder.typicode.com/users')
		.then(response => {
			const users = response.data.map(user => user.name)
			dispatch(fetchSuccess(users))
		})
		.catch(error => {
			dispatch(fetchError(error.message))
		})
	}
}

const store = createStore(reducer, applyMiddleware(thunk))
const unsubscribe = store.subscribe(() => {console.log(store.getState())})
store.dispatch(fetchUsers())