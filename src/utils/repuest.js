import store from '../store/store.js'

export function csrf(data){
	data["csrfmiddlewaretoken"] = store.state.csrf_token
    return data
}
}