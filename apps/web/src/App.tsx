import { ROUTES_PATH } from "@create-resume/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import {
	AuthProvider,
	LoginPage,
	RegisterPage,
	useAuth,
} from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import {
	ResumeCreatePage,
	ResumeEditPage,
	ResumeViewPage,
} from "@/features/resume";
import { queryClient } from "@/lib/query";

function PrivateRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to={ROUTES_PATH.LOGIN} replace />;
	}

	return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to={ROUTES_PATH.DASHBOARD} replace />;
	}

	return <>{children}</>;
}

function AppRoutes() {
	return (
		<Routes>
			{/* Public routes */}
			<Route
				path={ROUTES_PATH.LOGIN}
				element={
					<PublicRoute>
						<LoginPage />
					</PublicRoute>
				}
			/>
			<Route
				path={ROUTES_PATH.REGISTER}
				element={
					<PublicRoute>
						<RegisterPage />
					</PublicRoute>
				}
			/>

			{/* Private routes with layout */}
			<Route
				element={
					<PrivateRoute>
						<AppLayout />
					</PrivateRoute>
				}
			>
				<Route path={ROUTES_PATH.DASHBOARD} element={<DashboardPage />} />
				<Route
					path={ROUTES_PATH.RESUME_CREATE}
					element={<ResumeCreatePage />}
				/>
				<Route path={ROUTES_PATH.RESUME_VIEW} element={<ResumeViewPage />} />
				<Route path={ROUTES_PATH.RESUME_EDIT} element={<ResumeEditPage />} />
			</Route>

			{/* Redirects */}
			<Route
				path="/"
				element={<Navigate to={ROUTES_PATH.DASHBOARD} replace />}
			/>
			<Route
				path="*"
				element={<Navigate to={ROUTES_PATH.DASHBOARD} replace />}
			/>
		</Routes>
	);
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
