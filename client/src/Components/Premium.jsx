import { useState } from 'react';
import {BASE_URL} from '../utils/Constant'
import axios from 'axios'
import { useEffect } from 'react';

const Premium = () => {

  const[isUserPremium, setIsUserPremium] = useState(false);
  useEffect(()=>{
    verifyPremiumUser()
  },[]);

  const verifyPremiumUser = async()=>{

    const res = await axios.get(BASE_URL + "/premium/verify",{
      withCredentials:true,
    });

    if(res.data.isPremium){
        setIsUserPremium(true);
    }
  }
   
  const handleBuyClick = async(type)=>{

      const order = await axios.post(BASE_URL + "/payment/create",
        { 
          membershipType:type,
        },
        {withCredentials:true}
      );

      const {amount,currency,notes,orderId} = order?.data?.savedPayment;
      
      // Open Razorpay Dialog Box Checkout.
      const options = {
        key: order.data.keyId, 
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency,
        name: 'DevTinder',
        description: 'Connect to other developers',
        order_id: orderId, // This is the order_id created in the backend
        // callback_url: 'http://localhost:3000/payment-success', // Your success URL
        prefill: {
          name:notes.firstName + " " + notes.lastName,
          email:notes.emailId,
          contact : "9999999999"
        },
        theme: {
          color: '#F37254'
        },
        handler: verifyPremiumUser,
      };

     const rzp = new window.Razorpay(options);
     rzp.open();
  }

  return (
      isUserPremium? "You are already a premium member" :<div className="m-6">
      <h1 className="text-center text-2xl font-bold mb-8">
        Choose Your Membership
      </h1>
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch">
        <div className="card bg-base-300 rounded-box p-6 flex-1">
          <h2 className="font-bold text-xl text-center mb-4">Silver Membership</h2>
          <ul className="mb-4 space-y-1">
            <li>- Chat with other people</li>
            <li>- 100 connection requests per day</li>
            <li>- Blue Tick</li>
            <li>- 3 months</li>
          </ul>
          <button onClick={()=>handleBuyClick("silver")} className="btn btn-secondary w-full">Buy Silver</button>
        </div>

        <div className="divider lg:divider-horizontal">OR</div>


        <div className="card bg-base-300 rounded-box p-6 flex-1">
          <h2 className="font-bold text-xl text-center mb-4">Gold Membership</h2>
          <ul className="mb-4 space-y-1">
            <li>- Chat with other people</li>
            <li>- Infinite connection requests per day</li>
            <li>- Blue Tick</li>
            <li>- 6 months</li>
          </ul>
          <button onClick={()=>handleBuyClick("gold")} className="btn btn-primary w-full">Buy Gold</button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
