import style from "./style.module.scss";
import Slider from "@/components/molecules/Slider";

export default function FOCompetitionPortalList() {
   return (
       <div className={style.container}>
           <div className={style.boxSingle}>
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
                   height="300px"
               />
           </div>
           <div className={style.boxDuo}>
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
                   height="300px"
               />
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
                   height="300px"
               />
           </div>
       </div>
    );
}
