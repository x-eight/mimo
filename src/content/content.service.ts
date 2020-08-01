import { Injectable, Logger, NotImplementedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { db } from "../config/app";
import { Model } from 'mongoose';
import slugify from 'slugify';
import { NewContent } from "./dto/newContent";
import { UpdateContent } from "./dto/updateContent";
import { IContent } from './content.schema';
import { IChapter } from 'src/chapter/chapter.schema';
import { CatchId } from './dto/catchId';
import { AwsUpload } from './files/aws';

@Injectable()
export class ContentService {
    private logger = new Logger('ChapterService');
    constructor(
        @InjectModel(db.collContent)
        private contentModel: Model<IContent>,

        @InjectModel(db.collChapter)
        private chapterModel: Model<IChapter>,

        private aws: AwsUpload,
    ) { }

    async newContent(
        contentDto: NewContent,
    ): Promise<IContent> {
        const chapter = await this.chapterModel.findById(contentDto.chapterId)
        if (!chapter) {
            this.logger.verbose(`chapter dont exist`);
            throw new NotImplementedException(`chapter dont exist`);
        }
        try {
            contentDto.slug = chapter.slug + "/" + slugify(contentDto.name, { lower: true })
            const content = await new this.contentModel(contentDto)
            chapter.contentId = chapter.contentId.concat(content._id)
            await chapter.save()
            await content.save()
            return content
        } catch (error) {
            this.logger.verbose(`dont create content`);
            throw new NotImplementedException(error);
        }
    }

    async getTotalContent(
    ): Promise<IContent[]> {
        return this.contentModel.find()
    }

    async getContentOfChapter(
        contentId: CatchId,
    ): Promise<IContent[]> {
        const { id } = contentId
        let iContent = []
        const chapter = await this.chapterModel.findById(id)
        for (let index = 0; index < chapter.contentId.length; index++) {
            let getCourse = await this.contentModel.findById(chapter.contentId[index]).populate('contentId', 'name video file')
            await iContent.push(getCourse)
        }

        return iContent
    }

    async getContent(
        contentId: CatchId,
    ): Promise<IContent> {
        const { id } = contentId
        const content = await this.contentModel.findById(id)
        return content
    }

    async updateContent(
        contentId: CatchId,
        contentDto: UpdateContent,
    ): Promise<IContent> {
        const { id } = contentId
        try {
            const content = await this.contentModel.findById(id)
            content.name = contentDto.name
            const slug1 = (content.slug).split('/');
            content.slug = slug1[0] + "/" + slug1[1] + "/" + slugify(contentDto.name, { lower: true })
            content.updateAt = new Date()
            return content.save()
        } catch (error) {
            this.logger.verbose(`cant update content`);
            throw new NotImplementedException(error);
        }
    }

    async uploadFile(
        contentId: CatchId,
        file,
    ): Promise<string> {
        const id  = <any>contentId
        
        const content = await this.contentModel.findById(id);
        console.log(content)
        //const url = this.aws.fileupload(id, file)
        const url = await this.aws.fileupload(id, file).then(data => {
            return data
        }
        )

        content.file = url
        content.updateAt = new Date()
        await content.save()
        return url

    }

    async deleteContent(
        chapterId: CatchId,
    ): Promise<{ delete: string }> {
        const { id } = chapterId
        try {
            const result = await this.contentModel.deleteOne({ _id: id});

            //--------------------------//
            const course = await this.chapterModel.findById(id);
            if (!course) {
                this.logger.verbose(`dont exist course`);
                throw new NotImplementedException(`dont exist course`);
            }
            course.contentId = course.contentId.filter(element => {
                return element !== id
            });
            await course.save();
            //--------------------------//
            return { delete:`Deleted ${result.deletedCount} item.` }
        } catch (error) {
            this.logger.verbose(`Delete failed with error: ${error}`);
            throw new NotFoundException(`Delete failed with error: ${error}`)
        }
    }

    async removeContent(
        chapterId: CatchId,
    ): Promise<{ delete: string }> {
        const { id } = chapterId
        try {
            const result = await this.chapterModel.deleteOne({ _id: id});
            return { delete:`Deleted ${result.deletedCount} item.` }
        } catch (error) {
            this.logger.verbose(`Delete failed with error: ${error}`);
            throw new NotFoundException(`Delete failed with error: ${error}`)
        }
    }

}
