<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Product;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    private $repository;
    private $em;

    public function __construct(CategoryRepository $repository, EntityManagerInterface $em)
    {
        $this->repository = $repository;
        $this->em = $em;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', null, [
                'label' => 'nom',
            ])
            ->add('description', null, [
                'label' => 'description',
            ])
            ->add('categories', EntityType::class, [
                'class' => Category::class,
                'label' => 'catégories',
                'choice_label' => 'name',
                'multiple' => true,
                'expanded' => true,
                'data' => $options['categories'],
            ])
            ->add('options', CollectionType::class, [
                'entry_type' => OptionType::class,
                'label' => 'options',
                'allow_add' => true,
                'allow_delete' => true,
            ])
            ->add('relatedProducts', null, [
                'label' => 'produits associés',

                'multiple' => true,
                'expanded' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
            'categories' => [],
        ]);
    }
}
