import React from 'react';
import Headers from "../components/header/index.jsx";
import icons from "../assets/icons/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import Title from "../components/title/index.jsx";

function OnboardingPage() {
    return (
        <div className='flex-1 flex flex-col'>
            <Title title="Dashboard" descricao={"Acompanhe o processo de integração dos novos colaboradores"}/>
            <QuickInformations cards={[
                {title: "Novos fucionários", value: 2, icon: icons.onboarding},
                {title: "Em treinamento",  value: 1, color: "yellow"},
                {title: "Pendente avaliação",  value: 0 },
                {title: "Concluídos", value: 0 , color: "green"}
            ]}
            />
        </div>
    )
}
export default OnboardingPage;