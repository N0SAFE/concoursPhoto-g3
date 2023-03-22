<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordHasherInterface;

#[Route('/api', name: 'user_')]
class UserController extends AbstractController
{
    // #[Route('/users', name: 'users', methods: ['GET'])]
    // public function users(ManagerRegistry $doctrine): Response
    // {
    //     if (!$this->isGranted('ROLE_ADMIN')) {
    //         return $this->json(['message' => 'You are not authorized to access this resource'], 403);
    //     }
    //     $users = $doctrine->getRepository(User::class)->findAll();
    //     return $this->json($users);
    // }
    
    // #[Route('/user/{id}', name: 'user', methods: ['GET'])]
    // public function user(ManagerRegistry $doctrine, int $id): Response
    // {
    //     $user = $doctrine->getRepository(User::class)->find($id);
    //     if (!$user) {
    //         return $this->json(['message' => 'User not found'], 404);
    //     }
    //     return $this->json($user);
    // }
    
    // #[Route('/user/{id}', name: 'delete_user', methods: ['DELETE'])]
    // public function deleteUser(ManagerRegistry $doctrine, int $id): Response
    // {
    //     $user = $doctrine->getRepository(User::class)->find($id);
    //     if (!$user) {
    //         return $this->json(['message' => 'User not found'], 404);
    //     }
    //     if (!$this->isGranted('ROLE_ADMIN') && $user->getId() !== $this->getUser()->getId()) {
    //         return $this->json(['message' => 'You are not authorized to access this resource'], 403);
    //     }
    //     $em = $doctrine->getManager();
    //     $em->remove($user);
    //     $em->flush();
    //     return $this->json(['message' => 'User deleted successfully']);
    // }
    
    // #[Route('/user/{id}', name: 'update_user', methods: ['PUT'])]
    // public function updateUser(ManagerRegistry $doctrine, int $id, Request $request): Response
    // {
    //     $user = $doctrine->getRepository(User::class)->find($id);
    //     if (!$user) {
    //         return $this->json(['message' => 'User not found'], 404);
    //     }
    //     if (!$this->isGranted('ROLE_ADMIN') && $user->getId() !== $this->getUser()->getId()) {
    //         return $this->json(['message' => 'You are not authorized to access this resource'], 403);
    //     }
    //     $em = $doctrine->getManager();
    //     $decoded = json_decode($request->getContent());
    //     $email = $decoded->email;
    //     $user->setEmail($email);
    //     $em->persist($user);
    //     $em->flush();
    //     return $this->json(['message' => 'User updated successfully']);
    // }
    
    // #[Route('/user', name: 'create_user', methods: ['POST'])]
    // public function createUser(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordHasher): Response
    // {
    //     $em = $doctrine->getManager();
    //     $decoded = json_decode($request->getContent());
    //     $email = $decoded->email;
    //     $plaintextPassword = $decoded->password;
    //     $user = new User();
    //     $hashedPassword = $passwordHasher->hashPassword(
    //         $user,
    //         $plaintextPassword
    //     );
    //     $user->setPassword($hashedPassword);
    //     $user->setEmail($email);
    //     $user->setUsername($email);
    //     $em->persist($user);
    //     $em->flush();
    //     return $this->json(['message' => 'User created successfully']);
    // }
}