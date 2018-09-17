/** @format */

import Alert from 'antd/lib/alert';

import Head from '../components/head';
import Menu from '../components/Menu';
import ProductList from '../components/ProductList';

export default () => (
	<div>
		<Head title="Tiny Shopping" />
		<div>
			<div>
				<Menu />
			</div>
			<div>
				<Alert
					style={{ textAlign: 'center' }}
					showIcon={false}
					type="info"
					message="£5.00 offered for your order - £10.00 offered when you spend over £50.00 - £15.00 offered with a footwear item and spent over £75.00"
					banner
				/>
				<ProductList />
			</div>
		</div>
	</div>
);
