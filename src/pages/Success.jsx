import { Link } from "react-router-dom";


export default function Success(){

  return (

    <div className="
    min-h-screen
    bg-slate-950
    text-white
    flex
    items-center
    justify-center
    ">


      <div className="
      bg-slate-900
      p-10
      rounded-3xl
      text-center
      ">


        <h1 className="
        text-4xl
        font-bold
        text-cyan-400
        mb-5
        ">

          Order Placed Successfully 🎉

        </h1>



        <p className="text-slate-300 mb-8">

          Your order has been received.

        </p>



        <Link

          to="/buyer-dashboard"

          className="
          bg-cyan-500
          text-black
          px-8
          py-4
          rounded-xl
          font-bold
          hover:bg-cyan-400
          "

        >

          Go to Buyer Dashboard

        </Link>



      </div>


    </div>

  );

}