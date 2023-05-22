<?php

namespace App\Entity;

use App\Repository\NotificationLinkRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NotificationLinkRepository::class)]
class NotificationLink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notificationLinks')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'notificationLinks')]
    private ?NotificationType $notification = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getNotification(): ?NotificationType
    {
        return $this->notification;
    }

    public function setNotification(?NotificationType $notification): self
    {
        $this->notification = $notification;

        return $this;
    }
}
