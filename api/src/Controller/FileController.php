<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Entity\File;
use App\Service\FileUploader;

#[AsController]
class FileController extends AbstractController
{
    public function __invoke(Request $request, FileUploader $fileUploader): File
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        try {
            $fileOptions = $fileUploader->upload($uploadedFile);
        } catch (\Exception $e) {
            throw new BadRequestHttpException($e->getMessage());
        }

        $file = new File();
        $file->setPath($fileOptions['path']);
        $file->setSize($fileOptions['size']);
        $file->setExtension($fileOptions['extension']);
        $file->setType($fileOptions['type']);
        $file->setDefaultName($fileOptions['default_name']);

        return $file;
    }
}
