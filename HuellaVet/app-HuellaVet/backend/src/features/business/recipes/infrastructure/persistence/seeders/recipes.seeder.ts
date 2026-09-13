import { ConsultationModel } from '../../../../consultations/infrastructure/persistence/models/consultation.model.js';
import { RecipeModel } from '../models/recipe.model.js';

export async function seedRecipes(): Promise<void> {
  const count = await RecipeModel.count();
  if (count > 0) {
    return;
  }

  const consultation = await ConsultationModel.findOne({ order: [['id', 'ASC']] });
  if (!consultation) {
    return;
  }

  await RecipeModel.create({
    consultationId: consultation.id,
    name: 'Receta post-consulta',
    description: 'Indicaciones y tratamiento derivados de la consulta',
    isActive: true,
  });
}
