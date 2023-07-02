<?php

namespace App\Controller;

use App\Entity\Competition;
use App\Entity\Picture;
use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CheckController extends AbstractController {
    public function __construct(
        private Security $security,
        private CompetitionRepository $competitionRepository,
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
    ){}

    #[Route('/check-participation/{competition}', name: 'CheckController')]
    public function participation(Competition $competition): Response {

        $entityManager = $this->entityManager;
        $user = $this->security->getUser();
        $competition = $this->competitionRepository->findOneBy(['id' => $competition->getId()]);

        if (!$user || !$competition) {
            return $this->json(false);
        }

        $numberOfUserPictures = $competition->getPictures()->filter(fn(Picture $picture) => $picture->getUser() === $user)->count();

        // set roles ROLE_PHOTOGRAPHER if is the first time the user uploads a picture
        if (!in_array("ROLE_PHOTOGRAPHER", $user->getRoles()) && $numberOfUserPictures < 1) {

            $userSelected = $this->userRepository->findOneBy(['id' => $user->getId()]);

            $newArray = $userSelected->getRoles();
            array_push($newArray, "ROLE_PHOTOGRAPHER");
            $userSelected->setRoles($newArray);

            $entityManager->persist($userSelected);
            $entityManager->flush();

            return $this->json(true);
        } else if (in_array("ROLE_PHOTOGRAPHER", $user->getRoles()) && $numberOfUserPictures < $competition->getNumberOfMaxPictures()) {
            return $this->json(true);
        } else {
            return $this->json(false);
        }
    }
}