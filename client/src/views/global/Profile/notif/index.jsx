import BOForm from "@/components/organisms/BO/Form/index.jsx";
import Input from "@/components/atoms/Input/index.jsx";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext.jsx";
import Button from "@/components/atoms/Button";
import useLocation from "@/hooks/useLocation.js";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";

export default function IndexNotif() {
    return (
        <div>
            <h1>Mon compte</h1>
            <BOForm>
                <div style={{ marginTop: "10px" }}>
                    <h2>Si vous êtes simple membre</h2>
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
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <h2>Si vous êtes photographe</h2>
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
            </BOForm>
        </div>
    );
}
