import AWS from 'aws-sdk';

class S3Service {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  /**
   * Obtém a URL pré-assinada para um arquivo no S3
   * @param {string} key - Caminho do arquivo no bucket
   * @returns {Promise<string>} - URL válida por 24 horas
   */
  async getUrlFileByKey(key) {
    if (!key) {
      throw new Error('A chave (key) do arquivo é obrigatória.');
    }

    const params = {
      Bucket: process.env.AWS_ACCESS_BUCKETNAME,
      Key: key,
      Expires: 24 * 60 * 60, // 24 horas
    };

    try {
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Erro ao gerar URL pré-assinada:', error);
      throw new Error('Não foi possível gerar a URL pré-assinada.');
    }
  }
}

export default new S3Service();
