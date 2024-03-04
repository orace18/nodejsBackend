import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage }).single('photo');

export default ({ articleService }) =>
  class ArticleController {

      async create(req, res) {

        try {
          // Utiliser Multer pour télécharger la photo
          upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
              console.error('Multer Error:', err);
              return res.status(400).json({ message: 'Erreur lors du téléchargement de la photo' });
            } else if (err) {
              console.error('Upload Error:', err);
              return res.status(500).json({ message: 'Erreur interne lors du téléchargement de la photo' });
            }
            // Reste du code pour créer l'article après le téléchargement réussi
            const { nom, prix, promo_prix,description, categorie, merchant_id } = req.body;
            const existingMarchand = await merchantService.getById(merchant_id);
  
            if (!existingMarchand) {
              return res.status(404).json({ message: 'Marchand not found' });
            }
  
            const existingCategorie = await categorieService.findOne({ libelle: categorie });
  
            if (!existingCategorie) {
              return res.status(404).json({ message: 'Categorie not found' });
            }
  
            const newArticle = {
              message:'Article ajouté avec succès',
              nom,
              prix,
              promo_prix,
              description,
              categorie: existingCategorie.libelle,
              photo: req.file ? req.file.path : '', // Utilisez le chemin de la photo de Multer
              merchant_id: existingMarchand._id,
            };
  
            const createdArticle = await articleService.create(newArticle);
  
            res.status(201).json(createdArticle);
          });
        } catch (err) {
          console.error('Server Error:', err);
          res.status(500).send('Error in saving article');
        }
      }
      
    getAll(req, res, next) {
      articleService
        .getAll()
        .then((users) => res.json(users))
        .catch((err) => next(err));
    }

    // Get a user by userId in the request
    getById(req, res, next) {
        articleService
        .getById(req.params.id)
        .then((user) => (user ? res.json(user) : res.sendStatus(404)))
        .catch((err) => next(err));
    }

    async getArticleByMerchantId(req, res, next) {
      try {
          const merchantId = req.params.merchantId;
          const article = await articleService.getArticleByMerchantId(merchantId);
  
          if (article) {

              // Utilisez la méthode map pour itérer sur tous les éléments du panier
              const articleInfoPromises = article.map(async (articleItem) => {
                  // Utilisez l'ID de l'article pour interroger la base de données
                  const articleInfo = await articleService.getArticleById(articleItem.article_id);

              });
  
              // Attendez que toutes les promesses soient résolues
              const articlesInfo = await Promise.all(articleInfoPromises);
  
              const response = {
                  article: article,
              };
  
              res.json(response);
          } else {
              res.sendStatus(404);
          }
      } catch (err) {
          console.error('Server Error:', err);
          res.status(500).send('Error retrieving user cart');
      }
  }
    // Update a user identified by the userId in the request
    async update(req, res, next) {
      try {
        const articleId = req.params.id;
        const newData = req.body;

         if (!newData.nom) {
          return res.status(400).json({ message: 'Nom field is required' });
        }
        // Call the update method in the service
        const updatedArticle = await articleService.update(articleId, newData);

        if (updatedArticle) {
          // If the article is updated successfully, return the updated article
          res.json({updatedArticle,
            message: "Changement effectué avec succès"
          });
        } else {
          // If the article is not found, return a 404 status
          res.status(404).json({ message: 'Article not found' });
        }
      } catch (err) {
        // Handle errors here
        console.error('Server Error:', err);
        res.status(500).send('Error updating article');
      }
    }

    // Delete a user with the specified userId in the request
    delete(req, res, next) {
        articleService
        .delete(req.params.id)
        .then(() => res.status(201))
        .catch((err) => next(err));
    }

  };