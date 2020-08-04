import { Injectable, UnauthorizedException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProgress } from './progress.schema';
import { db } from 'src/config/app';
import { NewProgress } from './dto/newProgress';
import { IUsers } from 'src/users/users.schema';
import { ICourse } from 'src/course/course.schema';
import { IChapter, Chapter } from 'src/chapter/chapter.schema';
import { IContent } from 'src/content/content.schema';
import { StatusAdavance } from './new.enum/status';
import { UpdateProgress } from './dto/updateProgress';
import { strict } from 'assert';
import { CatchId } from './dto/catchId';


@Injectable()
export class ProgressService {

    constructor(
        @InjectModel(db.collProgress)
        private progressModel: Model<IProgress>,

        @InjectModel(db.collUser)
        private userModel: Model<IUsers>,

        @InjectModel(db.collCourse)
        private courseModel: Model<ICourse>,

        @InjectModel(db.collChapter)
        private chapterModel: Model<IChapter>,

        @InjectModel(db.collContent)
        private contentModel: Model<IContent>
    ) { }

    async newProgress(
        userId: IUsers,
        createProgress: NewProgress,
    ): Promise<IProgress> {
        createProgress.userId = userId.id
        let chapter = []
        let content = []
        const course = await this.courseModel.findById(createProgress.courseId)
        if (!course) {
            throw new UnauthorizedException('Invalid course');
        }

        for (let index = 0; index < course.chapterId.length; index++) {
            let getChapter = await this.chapterModel.findById(course.chapterId[index])

            for (let index = 0; index < getChapter.contentId.length; index++) {
                let getContent = await this.contentModel.findById(getChapter.contentId[index])
                await content.push({
                    id: getContent.id,
                    name: getContent.name,
                    status: StatusAdavance.NO
                })
            }

            await chapter.push({
                id: getChapter.id,
                contentId: content,
                name: getChapter.name
            })
            content = []
        }

        createProgress.chapter = chapter
        const test3 = await new this.progressModel(createProgress)
        return test3.save()
    }

    async updateProgress(
        userId: IUsers,
        ids: UpdateProgress,
    ): Promise<IProgress> {
        const course = await this.progressModel.findOne({ userId: userId.id, courseId: ids.CourseId })
        if (!course) {
            throw new UnauthorizedException('Invalid course');
        }

        try {
            const chapterId = course.chapter.findIndex((note, chapterId) => {
                return note.id === ids.ChapterId
            })
    
            const contentId = course.chapter[chapterId].contentId.findIndex((note, contentId) => {
                return note.id === ids.ContentId
            })
            const update = {
                $set:{ [`chapter.${chapterId}.contentId.${contentId}.status`] : ids.advance }
            };
    
            await course.updateOne(update);
    
            const updatecourse = await this.progressModel.findOne({ courseId: ids.CourseId })
    
            return updatecourse
        } catch (error) {
            throw new NotImplementedException(`update failed with error: ${error}`)
        }
    }

    async getProgress(
        userId: IUsers,
        courseId: CatchId,
    ):Promise<IProgress>{
        const { id } = courseId
        const course = await this.progressModel.findOne({ userId: userId.id , courseId: id })
        return course
    }


}



/*
    async newProgress(
        createProgress: NewProgress,
    ): Promise<IProgress> {
        const user = await this.userModel.findOne({ _id: createProgress.userId })
        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }
        await this.courseModel.findOne({ _id: createProgress.courseId })
            .then(async test1 => {
                let iContent = []
                let hola = []
                for (let index = 0; index < test1.chapterId.length; index++) {
                    let getCourse = await this.chapterModel.findById(test1.chapterId[index])//.populate('contentId', 'name')
                    await iContent.push({
                        id: getCourse.id,
                        contentId: getCourse.contentId,
                        name: getCourse.name
                    })
                }
                return iContent
            }
            )
            .then(async test2 => {
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%")
                console.log(test2)
                test2.forEach(async test3 => {
                    console.log(test3.contentId)
                    //let getCourse = await this.chapterModel.findById(test1.chapterId[index])
                })
            }
            )
            .catch(err => {
                console.log(err);
            });



        return
    }
*/