import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="text-base-content/70 mt-2 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
