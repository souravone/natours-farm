import axios from 'axios';
import { showAlert } from './alert';
// import Stripe from 'stripe';

// const stripe = Stripe(
//   'pk_test_51NjGkgSAdmaTC4KzUr1kEGtkAn4ayFMPUak1G5tzU9uFsK5542NPwamnzBlxUOisnHce5g56ks6cW4ldkeEqD4rE003An2JoQN',
// );

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51NjGkgSAdmaTC4KzUr1kEGtkAn4ayFMPUak1G5tzU9uFsK5542NPwamnzBlxUOisnHce5g56ks6cW4ldkeEqD4rE003An2JoQN',
    );

    // get checkout session
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log(session);
    // create checkout form + process
    window.location.replace(session.data.session.url);

    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

//   window.location.replace(session.data.session.url);
//   location.assign(session.data.session.url);
