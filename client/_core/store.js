import { createStore, applyMiddleware } from 'redux';
import withRedux from 'next-redux-wrapper';
import nextReduxSaga from 'next-redux-saga';
import createSagaMiddleware from 'redux-saga';
//import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const bindMiddleware = middleware => {
	if (process.env.NODE_ENV !== 'production') {
		const { composeWithDevTools } = require('redux-devtools-extension');
		return composeWithDevTools(applyMiddleware(...middleware));
	}
	return applyMiddleware(...middleware);
};

export function configureStore(initialState = {}) {
	const store = createStore(
		rootReducer,
		initialState,
		bindMiddleware([sagaMiddleware])
		//bindMiddleware([sagaMiddleware, thunkMiddleware])
	);

	/**
	 * next-redux-saga depends on `runSagaTask` and `sagaTask` being attached to the store.
	 *
	 *   `runSagaTask` is used to rerun the rootSaga on the client when in sync mode (default)
	 *   `sagaTask` is used to await the rootSaga task before sending results to the client
	 *
	 */

	store.runSagaTask = () => {
		store.sagaTask = sagaMiddleware.run(rootSaga);
	};

	// run the rootSaga initially
	store.runSagaTask();
	return store;
}

export function withReduxSaga(BaseComponent) {
	return withRedux(configureStore)(nextReduxSaga(BaseComponent));
}
