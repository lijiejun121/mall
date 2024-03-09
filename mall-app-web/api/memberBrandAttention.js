import request from '@/utils/requestUtil.js'

export function createBrandAttention(data) {
	return request({
		method: 'POST',
		url: '/member/attention/add',
		data: data
	})
}

export function deleteBrandAttention(params) {
	return request({
		method: 'POST',
		
	})
}
