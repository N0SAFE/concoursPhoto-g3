import BOForm from "@/components/organisms/BO/Form/index.jsx";
import Button from "@/components/atoms/Button";
import style from "./style.module.scss";
import Loader from "@/components/atoms/Loader/index.jsx";
import Navlink from "@/components/molecules/Navlink/index.jsx";

export default function IndexNotif() {
    const [isLoading, setIsLoading] = useState(false)
    const profileRouteList = [
        { content: "Mon profil", to: "/me" },
        { content: "Mes préférences", to: "/preference" },
        { content: "Mes organisations", to: "/myorganization" },
        { content: "Concours créés par mon organisation", to: "/me" },
        { content: "Concours auxquels j’ai participé", to: "/me" },
        { content: "Mes publicités", to: "/me" },
    ];

    return (
        <Loader active={isLoading}>
            <div className={style.formContainer}>
                <Navlink base="/profile" list={profileRouteList} />
                <BOForm hasSubmit={true}>
                    <div style={{ marginTop: "10px" }}>
                        <h2>Si vous êtes simple membre</h2>
                        <div style={{ backgroundColor: "#F5F5F5", paddingBottom: "2%", paddingTop: "2%", paddingRight: "2%", paddingLeft: "2%" }}>
                            <input type="checkbox" id="scales" name="1"></input>
                            <label for="1">Être informé par email lorsqu'un nouveau concours est publié</label>
                            <br />
                            <input type="checkbox" id="scales" name="2"></input>
                            <label for="2">Être informé par email lorsqu’un concours entre en phase de vote</label>
                            <br />
                            <input type="checkbox" id="scales" name="3"></input>
                            <label for="3">Être informé par email 48h avant la date de fin des votes d’un concours</label>
                            <br />
                            <input type="checkbox" id="scales" name="4"></input>
                            <label for="4">Être informé par email lorsque les résultats d’un concours sont publiés</label>
                            <br />
                            <input type="checkbox" id="scales" name="5"></input>
                            <label for="5">Être informé par email lorsqu’une nouvel article/actualité est publiée dans le blog</label>
                            <br />
                        </div>

                        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                            <h2>Si vous êtes photographe</h2>
                            <div style={{ backgroundColor: "#F5F5F5", paddingBottom: "2%", paddingTop: "2%", paddingRight: "2%", paddingLeft: "2%" }}>
                                <input type="checkbox" id="scales" name="6"></input>
                                <label for="6">Être informé lorsqu’un nouveau concours est publié et que mon profil satisfait les critères de participation</label>
                                <br />
                                <input type="checkbox" id="scales" name="7"></input>
                                <label for="7">Être informé lorsqu’un concours entre en phase de soumission</label>
                                <br />
                                <input type="checkbox" id="scales" name="8"></input>
                                <label for="8">Être informé 48h avant la date de fin des soumissions d’un concours</label>
                                <br />
                            </div>
                        </div>
                    </div>
                    <div className={style.registerSubmit}>
                        <Button type="submit" name="Mettre à jour" color={"black"} textColor={"white"} padding={"14px 30px"} border={false} borderRadius={"44px"} width={"245px"} />
                    </div>
                </BOForm>
            </div>
        </Loader>
    );
}
