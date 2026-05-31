import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Give the Gift of Life</h1>
          <p className="py-6 text-base-content/80">
            Join our community of lifesavers. Your blood donation can bring hope and healing to those in critical need. Be a hero today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary">Join as a donor</Link>
            <Link to="/search" className="btn btn-outline btn-primary">Search Donors</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
