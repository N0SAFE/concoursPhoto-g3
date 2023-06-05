<?php

namespace App\Controller;

use App\Entity\Competition;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ViewedCompetitionPageController extends AbstractController
{
    #[Route('/competitions/{id}', name: 'app_viewed_competition_page', methods: ['PUT'])]
    public function show(Competition $competition, EntityManagerInterface $entityManager): Response
    {
        $count = $competition->setConsultationCount($competition->getConsultationCount() + 1);

        $entityManager->persist($count);
        $entityManager->flush();

        return $this->json(['message' => 'Competition visited successfully']);
    }
}
