<template>
	<view v-if="show" class="mask" @click="toggleMask" @touchmove.stop.prevent="stopPrevent" :style="{backgroundColor: backgroundColor}"
		>
		<view
			class="mask-content"
			@click.stop.prevent="stopPrevent"
			:style="[{
				height: config.height,
				transform: transform
			}]"
		>
			<scroll-view class="view-content" scroll-y>
				<view class="share-header">
					
				</view>
				<view class="share-list">
					<view 
						v-for="(item, index) in shareList" :key="index"
						class="share-item"
						@click="shareToFriend(item.text)"
					>
						<image :src="item.icon" mode=""></image>
						<text>{{item.text}}</text>
					</view>
				</view>
			</scroll-view>
			<view class="bottom b-t" @click="toggleMask">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				transform: 'translateY(50vh)',
				timer: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				show: false,
				config: {},
			};
		},
		props: {
			contentHeight: {
				type: Number,
				default: 0
			},
			hasTabbar: {
				type: Boolean,
				default: false
			},
			shareList: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		created() {
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				height: height,
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
		},
		methods: {
			toggleMask() {
				if (this.timer == 1) {
					return;
				}
				this.timer = 1;
				setTimeout(() => {
					this.timer = 0;
				}, 500)
				
				if (this.show) {
					this.transform = this.config.transform;
					this.backgroundColor = 'rgba(0,0,0,0)';
					setTimeout(() => {
						this.show = false;
						this.hasTabbar && uni.showTabBar();
					}, 200);
					return;
				}
				
				this.show = true;
				
				if (this.hasTabbar) {
					uni.hideTabBar({
						success: () => {
							setTimeout(() => {
								this.backgroundColor = this.config.backgroundColor;
								this.transform = 'translateY(0px)';
							}, 10)
						}
					});
				} else {
					setTimeout(() => {
						this.backgroundColor = this.config.backgroundColor;
						this.transform = 'translateY(0px)';
					}, 10)
				}
			},
			
			stopPrevent() {},
			
			shareToFriend(type) {
				this.$api.msg(`分享给${type}`);
				this.toggleMask();
			},
		}
	}
</script>

<style lang='scss'>
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