from stl import mesh
#pip install gmsh
#pip install trimesh[easy]
#
class STLParser:
    def __init__(self, filepath):
        """
        Инициализация парсера STL файла.
        :param filepath: Путь к STL файлу.
        """
        self.filepath = filepath
        self.mesh_data = None

    def parse(self):
        try:
            self.mesh_data = mesh.Mesh.from_file(self.filepath)
            print(f"STL файл '{self.filepath}' успешно загружен.")
        except Exception as e:
            print(f"Ошибка при загрузке STL файла: {e}")

    def get_vectors(self):
            return self.mesh_data.vectors

if __name__ == "__main__":
    parser = STLParser('Simulated_data_step/00000936.s')
    parser.parse()
    vectors = parser.get_vectors()

    if vectors is not None:
        print("Векторы загруженного STL файла:")
        print(vectors)
