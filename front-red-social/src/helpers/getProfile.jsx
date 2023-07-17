import {Global} from './Global';
export const getProfile = async (userId,setState) => {
    try {
        const request = await fetch(Global.url + 'user/profile/' + userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          }
        });
        const response = await request.json();
        if (response.status === 'success') {
            setState(response.user);
        }
        return response;
        
      } catch (error) {
        console.log(error);
      }
}