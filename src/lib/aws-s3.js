import AWS from 'aws-sdk';

class S3Service {
  constructor() {
    const isCustomEndpoint = !!process.env.AWS_ENDPOINT;

    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

      // MinIO não precisa de region real
      region: process.env.AWS_REGION || 'us-east-1',

      signatureVersion: 'v4',

      // 👇 ESSENCIAL para MinIO
      endpoint: isCustomEndpoint ? new AWS.Endpoint(process.env.AWS_ENDPOINT) : undefined,
      s3ForcePathStyle: true, // obrigatório para MinIO
    });
  }

  async getUrlFileByKey(key, expiresSec = 24 * 60 * 60) {
    if (!key) throw new Error('A chave (key) do arquivo é obrigatória.');

    const params = {
      Bucket: process.env.AWS_ACCESS_BUCKETNAME,
      Key: key,
      Expires: expiresSec,
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