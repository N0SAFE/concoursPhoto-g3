<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\FileRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\FileController;
use Symfony\Component\Serializer\Annotation\Groups;

#[
    ApiResource(
        operations: [
            new GetCollection(),
            new Post(controller: FileController::class, deserialize: false),
            new Post(name: FileController::PICTURES_FILE_SIZE, controller: FileController::class, uriTemplate: '/files/pictures', deserialize: false),
            new Post(name: FileController::COMPETITION_FILE_SIZE, controller: FileController::class, uriTemplate: '/files/competitions', deserialize: false),
            new Post(name: FileController::SPONSOR_FILE_SIZE, controller: FileController::class, uriTemplate: '/files/sponsors', deserialize: false),
            new Get(),
            new Delete(),
        ],
        normalizationContext: ['groups' => ['file:read']],
        denormalizationContext: ['groups' => ['file:write']]
    )
]
#[ORM\Entity(repositoryClass: FileRepository::class)]
class File
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['file:read', 'user:current:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file:read', 'user:current:read', 'file:write'])]
    private ?string $path = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file:read', 'file:write'])]
    private ?string $size = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file:read', 'file:write'])]
    private ?string $extension = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file:read', 'file:write'])]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file:read', 'user:current:read', 'file:write'])]
    private ?string $defaultName = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(string $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getExtension(): ?string
    {
        return $this->extension;
    }

    public function setExtension(string $extension): self
    {
        $this->extension = $extension;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getDefaultName(): ?string
    {
        return $this->defaultName;
    }

    public function setDefaultName(string $defaultName): self
    {
        $this->defaultName = $defaultName;

        return $this;
    }
}
