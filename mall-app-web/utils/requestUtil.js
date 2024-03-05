import Request from '@/js_sdk/luch-request/request.js'
import { API_BASE_URL } from '@/utils/appConfig.js';

const http = new Request();

http.setConfig((config) => {
	config.baseUrl = API_BASE_URL
	config.header = {
		...config.header
	}
	return config
})

http.validateStatus = (statusCode) => {
	return statusCode == 200
}

http.interceptor.request((config, cancel) => {
	const token = uni.getStorageSync('token');
	if (token) {
		config.header = {
			'Authorization': token,
			...config.header
		}
	} else {
		config.header = {
			...config.header
		}
	}
	
	return config
})

http.interceptor.response((response) => {
	const res = response.data;
	if (res.code !== 200) {
		uni.showToast({
			title: res.message,
			duration: 1500
		})
		
		if (res.code === 401) {
			uni.showModal({
				title: '提示',
				content: '你已被登出，可以取消继续留在该页面，或者重新登录',
				confirmText: '重新登录',
				cancelText: '取消',
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/public/login'
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
		return Promise.reject(response);
	} else {
		return response.data;
	}
}, (response) => {
	console.log('response error', response);
	uni.showToast({
		title: response.errMsg,
		duration: 1500
	})
	return Promise.reject(response);
})

export function request (options = {}) {
	return http.request(options);
}

export default request
