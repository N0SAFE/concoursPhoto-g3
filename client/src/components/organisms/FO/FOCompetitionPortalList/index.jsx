import style from "./style.module.scss";
import Slider from "@/components/atoms/Slider";

export default function FOCompetitionPortalList() {
   return (
       <div className={style.container}>
           <div className={style.boxSingle}>
               <div>
                   <Slider
                       slides={
                           [
                               { imagePath: "https://florianbompan.com/wp-content/uploads/2021/08/P1088718-2-scaled.jpg", imageAlt: "Une image" },
                               { imagePath: "https://florianbompan.com/wp-content/uploads/2021/08/P1088718-2-scaled.jpg", imageAlt: "Une image" },
                               { imagePath: "https://florianbompan.com/wp-content/uploads/2021/08/P1088718-2-scaled.jpg", imageAlt: "Une image" },
                               { imagePath: "https://florianbompan.com/wp-content/uploads/2021/08/P1088718-2-scaled.jpg", imageAlt: "Une image" },
                               { imagePath: "https://florianbompan.com/wp-content/uploads/2021/08/P1088718-2-scaled.jpg", imageAlt: "Une image" },
                           ]
                       }
                   />
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
