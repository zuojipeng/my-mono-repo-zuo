import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "../components/common";

const MainLayout = () => {
	return (
		<div className="min-h-screen bg-gray-900">
			<Navigation />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default memo(MainLayout);
