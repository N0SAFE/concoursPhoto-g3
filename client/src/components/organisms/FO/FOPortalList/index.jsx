import style from "./style.module.scss";
import Slider from "@/components/molecules/Slider";

export default function FOPortalList({boxSingle = [], boxSingleContents = [], boxUp = [], boxUpContents = [], boxDown = [], boxDownContents = []}) {
    return (
        <div className={style.container}>
            <div className={style.boxSingle}>
                {boxSingle.type === "slider" && (
                    <Slider
                        slides={
                            boxSingleContents.map((content) => {
                                return {
                                    imagePath: import.meta.env.VITE_API_URL + "/" + content.file.path,
                                    imageAlt: content.file.default_name
                                }
                            })
                        }
                    />
                )}
                {boxSingle.type === "picture" && (
                    <img src={import.meta.env.VITE_API_URL + "/" + boxSingle.path} alt={boxSingle.alt} />
                )}
            </div>
            <div className={style.boxDuo}>
                <>
                    {boxUp.type === "slider" && (
                        <Slider
                            slides={
                                boxUpContents.map((content) => {
                                    return {
                                        imagePath: import.meta.env.VITE_API_URL + "/" + content.file.path,
                                        imageAlt: content.file.default_name
                                    }
                                })
                            }
                        />
                    )}
                    {boxUp.type === "picture" && (
                        <img src={import.meta.env.VITE_API_URL + "/" + boxUp.path} alt={boxUp.alt} />
                    )}
                    {boxDown.type === "slider" && (
                        <Slider
                            slides={
                                boxDownContents.map((content) => {
                                    return {
                                        imagePath: import.meta.env.VITE_API_URL + "/" + content.file.path,
                                        imageAlt: content.file.default_name
                                    }
                                })
                            }
                        />
                    )}
                    {boxDown.type === "picture" && (
                        <img src={import.meta.env.VITE_API_URL + "/" + boxDown.path} alt={boxDown.alt} />
                    )}
                </>
            </div>
        </div>
    );
}
