

export const actionTypes = {
	LOAD_PAGE: 'page/load',
	LOAD_PAGE_SUCCESS: 'page/success',
	LOAD_PAGE_FAIL: 'page/load/fail',
	LOAD_PAGE_404: 'page/load/404',
	UPDATE_PAGE_CONTENT: 'page/update/content',
};


export default {
	loadPage: payload => ({
		payload,
		type: actionTypes.LOAD_PAGE,
	}),

	loadPageSuccess: payload => ({
		payload,
		type: actionTypes.LOAD_PAGE_SUCCESS,
	}),

	loadPageFail: () => ({
		type: actionTypes.LOAD_PAGE_FAIL,
	}),

	loadPage404: () => ({
		type: actionTypes.LOAD_PAGE_404,
	}),

	updatePageContent: payload => ({
		payload,
		type: actionTypes.UPDATE_PAGE_CONTENT,
	}),
};
