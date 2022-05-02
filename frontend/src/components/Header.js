const Header = ({ account }) => {
  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow w-100">
      <div className="align-items-center col-md-2 col-sm-3 d-flex gap-4 mr-0 mx-3 navbar-brand">
        Group 1
      </div>

      <div className="nav-link">
        <span id="account"> {account}</span>
      </div>
    </nav>
  );
};

export default Header;
