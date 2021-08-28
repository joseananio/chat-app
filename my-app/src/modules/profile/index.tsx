import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
// NOT USED!!!!
const Profile = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenWithPopup,
  } = useAuth0();

  // const [userMetadata, setUserMetadata] = useState(null);

  // useEffect(() => {
  //   const getUserMetadata = async (user: User) => {
  //     const domain = 'dev-manga.us.auth0.com';

  //     try {
  //       const accessToken = await getAccessTokenWithPopup({
  //         audience: `https://${domain}/api/v2/`,
  //         scope: 'read:current_user',
  //       });

  //       const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

  //       const metadataResponse = await fetch(userDetailsByIdUrl, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });

  //       const { user_metadata } = await metadataResponse.json();

  //       console.log('acc', user_metadata);
  //       setUserMetadata(user_metadata);
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //   };

  //   if (user) {
  //     getUserMetadata(user);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getAccessTokenWithPopup, user?.sub]);

  console.log('sdfdsf', isLoading, isAuthenticated);
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated && user ? (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {/* {userMetadata ? (
        <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
      ) : (
        'No user metadata defined'
      )} */}
    </div>
  ) : (
    <div>sds</div>
  );
};

export default Profile;
