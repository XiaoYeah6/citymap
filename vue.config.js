module.exports = {	
	// 百度地图的引入
	configureWebpack: {
		externals: {
			'BMap': 'BMap',
			// 'BMap_Symbol_SHAPE_POINT': 'BMap_Symbol_SHAPE_POINT'
		}
	}
}