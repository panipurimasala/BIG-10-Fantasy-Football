import React, {useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth0();

  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the dropdown visibility
  };


  return (
    <div>
      {/* <img src={user.picture} alt={user.name} /> */}
      <h2 className="profileName" onClick={toggleDropdown}>{user.name}</h2>
      <div>{isOpen &&
        <div className='dropdownContent'>
          <p className='dropdownText'>
            {user.email}
          </p>
          <p className='logout' onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </p>
        </div>
          }
      </div>
      
      
    </div>
  );
}

export default Profile