export default function Suppliers(){

  const suppliers = [

    {
      name:"Sharma Textiles",
      location:"India",
      rating:"4.8"
    },

    {
      name:"Global Denim Mills",
      location:"Gujarat",
      rating:"4.9"
    },

    {
      name:"Royal Silk House",
      location:"Karnataka",
      rating:"4.7"
    }

  ];



  return (

    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">


      <div className="max-w-6xl mx-auto">


        <h1 className="text-5xl font-bold">
          Verified Suppliers
        </h1>


        <p className="text-slate-400 mt-4 text-lg">
          Connect with trusted textile manufacturers.
        </p>




        <div className="grid md:grid-cols-3 gap-6 mt-10">


          {
            suppliers.map((supplier,index)=>(

              <div

                key={index}

                className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:scale-105 transition"

              >


                <h2 className="text-2xl font-bold">
                  {supplier.name}
                </h2>


                <p className="text-slate-400 mt-3">
                  Location: {supplier.location}
                </p>


                <p className="text-yellow-400 mt-3">
                  ⭐ {supplier.rating}
                </p>


                <button className="mt-5 bg-blue-600 px-5 py-2 rounded-xl">
                  View Supplier
                </button>


              </div>

            ))
          }


        </div>


      </div>


    </div>

  );

}