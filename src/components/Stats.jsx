export default function Stats(){

  const stats = [
    {
      number:"500+",
      title:"Verified Mills"
    },
    {
      number:"25K+",
      title:"Premium Products"
    },
    {
      number:"15K+",
      title:"Active Buyers"
    },
    {
      number:"98%",
      title:"Successful Orders"
    }
  ];


  return (

    <section className="py-20 bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6">


        {
          stats.map((item,index)=>(

            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center"
            >

              <h2 className="text-4xl font-bold text-cyan-400">
                {item.number}
              </h2>


              <p className="mt-3 text-slate-400">
                {item.title}
              </p>


            </div>

          ))
        }


      </div>

    </section>

  );

}