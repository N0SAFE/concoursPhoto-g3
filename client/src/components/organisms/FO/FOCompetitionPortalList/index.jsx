import style from "./style.module.scss";

export default function FOCompetitionPortalList() {
   return (
       <div className={style.container}>
           <div className={style.boxSingle}>
               <div>
                   box solo
               </div>
           </div>
           <div className={style.boxDuo}>
               <div>
                   box 1/2
               </div>
               <div>
                   box 2/2
               </div>
           </div>
       </div>
    );
}
