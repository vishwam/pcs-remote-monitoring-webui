// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Temp } from './temp';

// Pass the devices status
const mapStateToProps = state => ({
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
});

export const TempContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Temp));
