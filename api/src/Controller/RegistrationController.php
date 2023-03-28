<?php

namespace App\Controller;

use App\Entity\Role;
use App\Repository\GenderRepository;
use App\Repository\RoleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\Gender;

#[Route('/api', name: 'api_')]

class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function index(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordHasher, GenderRepository $genderRepository, RoleRepository $roleRepository): Response
    {

        $em = $doctrine->getManager();
        $decoded = json_decode($request->getContent());
        $plaintextPassword = $decoded->password;

        $user = new User();
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $plaintextPassword
        );

        $user->setState($decoded->state);
        $user->setCreationDate(new \DateTime($decoded->creation_date));
        $user->setGender($genderRepository->find($decoded->gender));
        $user->setFirstname($decoded->firstname);
        $user->setLastname($decoded->lastname);
        $user->setDateOfBirth(new \DateTime($decoded->date_of_birth));
        $user->setAddress($decoded->address);
        $user->setPostcode($decoded->postcode);
        $user->setCity($decoded->city);
        $user->setCountry($decoded->country);
        $user->setEmail($decoded->email);
        $user->setPhoneNumber($decoded->phone_number);
        $user->setPassword($hashedPassword);

        $user->setPseudonym($decoded->email);
        $user->setRoles([$decoded->role]);  

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Registered Successfully']);
    }
}
