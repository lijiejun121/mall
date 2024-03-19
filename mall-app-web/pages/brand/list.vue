<template>
	<view class="content">
		<image src="/static/recommend_brand_banner.png" class="banner-image"></image>
		<view class="section-tit">相关品牌</view>
		<view class="goods-list">
			<view v-for="(item, index) in brandList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.logo" mode="aspectFit"></image>
				</view>
				<text class="title clamp">{{item.name}}</text>
				<text class="title2">商品数量：{{item.productCount}}</text>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import {
		fetchBrandRecommendList
	} from '@/api/brand.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				loadingType: 'more',
				brandList: [],
				searchParam: {
					pageNum: 1,
					pageSize: 6
				}
			};
		},
		
		onLoad(options) {
			this.loadData();
		},
		
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		
		onReachBottom() {
			this.searchParam.pageNum++;
			this.loadData();
		},
		
		methods: {
			async loadData(type = 'add', loading) {
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
				}
				
				if (type === 'refresh') {
					this.searchParam.pageNum = 1;
					this.brandList = [];
				}
				fetchBrandRecommendList(this.searchParam).then(response => {
					let prandList = response.data;
					if (response.data.length === 0) {
						this.loadingType = 'nomore';
						this.searchParam.pageNum--;
					} else {
						if (response.data.length < this.searchParam.pageSize) {
							this.loadingType = 'nomore';
							this.searchParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.brandList = this.brandList.concat(prandList);
					}
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading();
						} else {
							uni.stopPullDownRefresh();
						}
					}
				});
			},
			
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/brand/brandDetail?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}
	
	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit {
			flex-shrink: 0;
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		
		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		
		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	
	.default-row {
		margin-top: 16upx;
		
		.tit {
			flex: 1;
		}
		
		switch {
			transform: translateX(16upx) scale(.9);
		}
	}
	
	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>