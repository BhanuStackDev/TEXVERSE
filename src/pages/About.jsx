export default function About(){

  return (

    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">


      <div className="max-w-5xl mx-auto">


        <h1 className="text-5xl font-bold">
          About TEXVERSE
        </h1>


        <p className="text-slate-400 mt-6 text-lg">

          TEXVERSE is an AI powered B2B textile marketplace
          connecting buyers with verified textile suppliers.

        </p>



        <div className="grid md:grid-cols-3 gap-6 mt-10">


          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

            <h2 className="text-xl font-bold">
              AI Recommendations
            </h2>

            <p className="text-slate-400 mt-3">
              Smart fabric suggestions based on buyer requirements.
            </p>

          </div>




          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

            <h2 className="text-xl font-bold">
              Verified Suppliers
            </h2>

            <p className="text-slate-400 mt-3">
              Connect with trusted textile manufacturers.
            </p>

          </div>




          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

            <h2 className="text-xl font-bold">
              Bulk Trading
            </h2>

            <p className="text-slate-400 mt-3">
              Easy B2B textile sourcing for bulk orders.
            </p>

          </div>


        </div>


      </div>


    </div>

  );

}